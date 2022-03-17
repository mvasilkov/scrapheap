from functools import partial


class Thunk:
    def __init__(self, parent: 'ApigeeClient', path):
        self.parent = parent
        self.path = [] if path is None else path

    def __call__(self, *args, **kwargs):
        copy_path = []
        copy_path.extend(self.path)
        copy_path.extend(args)

        return Thunk(self.parent, copy_path)

    def __getattr__(self, attr):
        result = getattr(self.parent, attr)

        if isinstance(result, Thunk):
            result.path = self.path + result.path

        elif callable(result):
            result = partial(result, thunk=self)

        return result


class ApigeeClient:
    def __init__(self):
        self.origin = 'https://api.enterprise.apigee.com'

    def __getattr__(self, attr):
        return Thunk(self, [attr])

    def get(self, thunk=None):
        path = [] if thunk is None else thunk.path
        path_string = '/'.join(path)

        print(f'GET {self.origin}/{path_string}')


def run():
    client = ApigeeClient()

    client_org = client.organizations('org')

    environments = client_org.environments().get()
    environments = client_org.environments.get()

    noname_target_server = client.organizations('org1').environments('staging').targetservers('noname').get()


if __name__ == '__main__':
    run()
