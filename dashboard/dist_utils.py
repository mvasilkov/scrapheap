from integlib.ssh import SshHost


def get_dist_status():
    dist = SshHost('dist.infinidat.com', user='root', password='xsignnet1')
    dfh, _, _ = dist.send_command('df -h')
    ducks, _, _ = dist.send_command('du -cks -h /opt/webdav/infinibox-modules')

    try:
        opt_line = next(a for a in dfh.splitlines() if a.endswith('/opt'))
        ftp_size, ftp_used, ftp_free = opt_line.split()[1:4]
    except StopIteration:
        ftp_size, ftp_used, ftp_free = None, None, None

    try:
        total_line = next(a for a in ducks.splitlines() if a.endswith('total'))
        modules_used = total_line.split()[0]
    except StopIteration:
        modules_used = None

    return {
        'ftp_size': ftp_size,
        'ftp_used': ftp_used,
        'ftp_free': ftp_free,
        'modules_used': modules_used,
    }
