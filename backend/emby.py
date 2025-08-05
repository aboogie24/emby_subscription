import requests

from utils import generate_password
import os
from dotenv import load_dotenv

load_dotenv()

EMBY_SERVER_URL = os.getenv("EMBY_SERVER_URL")
EMBY_API_KEY = os.getenv("EMBY_API_KEY")


DEFAULT_POLICY = {
    "IsAdministrator": False,
    "IsHidden": False,
    "IsHiddenRemotely": False,
    "EnableLiveTvManagement": False,
    "EnableLiveTvAccess": True,
    "EnableContentDownloading": True,
    "EnableRemoteControlOfOtherUsers": False,
    "EnableSharedDeviceControl": True,
    "EnableRemoteAccess": True,
    "EnableMediaPlayback": True
}

def set_emby_user_status(user_id: str, is_disabled: bool):
    url = f"{EMBY_SERVER_URL}/emby/Users/{user_id}/Policy"
    headers = {
        "X-Emby-Token": EMBY_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "IsDisabled": is_disabled
    }
    r = requests.post(url, headers=headers, json=payload)
    return r.status_code, r.text

def get_emby_user_id(username: str):
    url = f"{EMBY_SERVER_URL}/emby/Users"
    headers = {"X-Emby-Token": EMBY_API_KEY}
    r = requests.get(url, headers=headers)
    for user in r.json():
        if user["Name"].lower() == username.lower():
            return user["Id"]
    return None



def create_emby_user(username: str) -> (str, str):
    """
    Creates a new Emby user by name.
    Returns the Emby user ID if successful, otherwise None.
    """

    password = generate_password()

    url = f"{EMBY_SERVER_URL}/emby/Users/New"
    headers = {
        "X-Emby-Token": EMBY_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {"Name": username}
    user_id = None
    try:
        r = requests.post(url, headers=headers, json=payload)
        if r.status_code == 200:
            user_id = r.json().get("Id")
        else:
            print(f"Failed to create Emby user {username}: {r.text}")
            return None, None
    except Exception as e:
        print(f"Error creating Emby user: {e}")
        return None, None

    # Set password
    url_password = f"{EMBY_SERVER_URL}/emby/Users/{user_id}/Password"
    password_payload = {
        "CurrentPw": "", 
        "NewPw": password,
        "ResetPassword": False
    }
    r_pass = requests.post(url_password, headers=headers, json=password_payload)
    if r_pass.status_code != 204:
        print(f"Failed to set password for {username}: {r_pass.text}")

    # Step 4: Assign default policy
    url_policy = f"{EMBY_SERVER_URL}/emby/Users/{user_id}/Policy"
    policy_payload = DEFAULT_POLICY.copy()
    policy_payload["IsDisabled"] = True
    r_policy = requests.post(url_policy, headers=headers, json=policy_payload)
    if r_policy.status_code != 204:
        print(f"Failed to set policy for {username}: {r_policy.text}")

    return user_id, password
