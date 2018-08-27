GLaDOS
===

**Starting the server**

The app runs on uWSGI, with nginx as a reverse proxy in front of it.

    systemctl start glados
    systemctl status glados

The symlinks are as follows:

    /etc/systemd/system/glados.service -> {repo}/server/uwsgi.service
    /etc/systemd/system/glados-worker.service -> {repo}/server/queueapp-worker.service
    /etc/nginx/sites-enabled/glados.conf -> {repo}/server/glados.conf
