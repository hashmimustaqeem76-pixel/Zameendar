# GitHub Upload Instructions

The target repo exists and is currently empty:

https://github.com/hashmimustaqeem76-pixel/Zameendar

## Steps to upload the project

1. Open PowerShell in the project folder:
   ```powershell
   cd "c:\Users\Digital Nexus\Downloads\files"
   ```

2. Run the upload script:
   ```powershell
   .\upload_to_github.ps1
   ```

3. If Git is not installed, install it from https://git-scm.com/downloads and rerun the script.

4. If Git prompts for credentials, provide your GitHub username and password or personal access token.

---

## What the script does

- initializes a local Git repository (if needed)
- adds all files
- creates a commit
- adds the remote origin
- pushes to `main`
