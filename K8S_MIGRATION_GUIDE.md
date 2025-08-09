# Kubernetes Database Migration Guide

This guide explains how to handle SQLite database migrations in Kubernetes deployments with persistent volumes.

## Overview

Your application uses SQLite with two migration scripts:
- `migrate_database.py` - Adds subscription plan features
- `admin_migration.py` - Adds admin management features

## Migration Strategies

### 1. Helm Hook Job (Recommended)

The migration job runs automatically before deployments using Helm hooks.

**Configuration:**
```yaml
# values.yaml
migration:
  enabled: true
  version: ""  # Optional: specify version for unique job names
```

**How it works:**
1. Before each `helm install` or `helm upgrade`, a migration job runs
2. The job mounts the same persistent volume as your backend
3. Runs both migration scripts in sequence
4. Job is automatically cleaned up after success

**Deploy with migrations:**
```bash
# Enable migrations and deploy
helm upgrade --install emby-subscription ./chart \
  --set migration.enabled=true \
  --set backend.image.tag=v1.2.3
```

### 2. Manual Migration (For existing deployments)

If you need to run migrations on an existing deployment:

```bash
# Create a temporary pod with access to the persistent volume
kubectl run migration-pod \
  --image=aboogie/emby-backend:v1.2.3 \
  --restart=Never \
  --rm -i --tty \
  --overrides='
{
  "spec": {
    "containers": [
      {
        "name": "migration",
        "image": "aboogie/emby-backend:v1.2.3",
        "command": ["/bin/sh"],
        "env": [
          {"name": "DATABASE_URL", "value": "sqlite:///app/data/subscriptions.db"}
        ],
        "volumeMounts": [
          {"name": "backend-storage", "mountPath": "/app/data"}
        ]
      }
    ],
    "volumes": [
      {
        "name": "backend-storage",
        "persistentVolumeClaim": {"claimName": "emby-backend-pvc"}
      }
    ]
  }
}' \
  -- sh -c "cd /app && python migrate_database.py && python admin_migration.py"
```

### 3. Init Container Approach

Add an init container to your deployment:

```yaml
# In backend-deployment.yaml
spec:
  template:
    spec:
      initContainers:
      - name: migration
        image: {{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}
        command: ["/bin/sh", "-c"]
        args:
          - |
            export DATABASE_URL="sqlite:///{{ .Values.backend.persistence.mountPath }}/subscriptions.db"
            python migrate_database.py
            python admin_migration.py
        env:
        {{- range $key, $value := .Values.backend.env }}
        - name: {{ $key }}
          value: "{{ $value }}"
        {{- end }}
        volumeMounts:
        - name: backend-storage
          mountPath: {{ .Values.backend.persistence.mountPath }}
        workingDir: /app
```

## Database Backup Strategy

### Before Migration
```bash
# Create a backup job
kubectl create job backup-db --from=cronjob/backup-cronjob
```

### Backup CronJob Template
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-cronjob
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: alpine:latest
            command:
            - /bin/sh
            - -c
            - |
              apk add --no-cache sqlite
              cd /app/data
              sqlite3 subscriptions.db ".backup subscriptions-$(date +%Y%m%d-%H%M%S).db"
              # Keep only last 7 backups
              ls -t subscriptions-*.db | tail -n +8 | xargs -r rm
            volumeMounts:
            - name: backend-storage
              mountPath: /app/data
          volumes:
          - name: backend-storage
            persistentVolumeClaim:
              claimName: emby-backend-pvc
          restartPolicy: OnFailure
```

## Troubleshooting

### Check Migration Job Status
```bash
# List migration jobs
kubectl get jobs -l app.kubernetes.io/name=emby-migration

# Check job logs
kubectl logs job/emby-migration-v1-2-3

# Describe job for details
kubectl describe job emby-migration-v1-2-3
```

### Access Database Directly
```bash
# Connect to a pod with database access
kubectl exec -it deployment/emby-backend -- /bin/sh

# Check database schema
sqlite3 /app/data/subscriptions.db ".schema"

# Check table contents
sqlite3 /app/data/subscriptions.db "SELECT * FROM subscriptions LIMIT 5;"
```

### Common Issues

1. **Permission Issues**
   ```bash
   # Fix ownership if needed
   kubectl exec -it deployment/emby-backend -- chown -R app:app /app/data
   ```

2. **Database Locked**
   ```bash
   # Check for running processes
   kubectl exec -it deployment/emby-backend -- lsof /app/data/subscriptions.db
   ```

3. **Migration Job Fails**
   ```bash
   # Check job events
   kubectl describe job emby-migration-v1-2-3
   
   # Check pod logs
   kubectl logs -l job-name=emby-migration-v1-2-3
   ```

## Best Practices

1. **Always backup before migrations**
2. **Test migrations in staging first**
3. **Use Helm hooks for automatic migrations**
4. **Monitor migration job completion**
5. **Keep migration scripts idempotent** (safe to run multiple times)
6. **Use versioned migration job names** to avoid conflicts

## Deployment Workflow

```bash
# 1. Build and push new image
docker build -t aboogie/emby-backend:v1.2.3 .
docker push aboogie/emby-backend:v1.2.3

# 2. Deploy with migrations enabled
helm upgrade --install emby-subscription ./chart \
  --set backend.image.tag=v1.2.3 \
  --set migration.enabled=true \
  --wait

# 3. Verify migration success
kubectl logs job/emby-migration-v1-2-3

# 4. Check application health
kubectl get pods
kubectl logs deployment/emby-backend
```

This approach ensures your database migrations run safely and automatically in your Kubernetes environment.
