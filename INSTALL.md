# HOW TO INSTALL

## WINDOWS

In windows you can add the compiled executable file to [Task Scheduler](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page) to run when system boots. This requires a valid .env file to be present at the same location as the executable file.

## LINUX

A systemd service configuration file will need to be created to run as a service when the system starts, either including environment variable in the service config or as a separate file.