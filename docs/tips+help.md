## Tips & Help

- **Premium neighbors:** To become a premium neighbor yourself to others, you need to allow the "getNodeInfo" in your node's iri configuration. To do this, ensure that `getNodeInfo` is **not** in the `REMOTE_LIMIT_API` field of your IRI config.
- **Permission errors:** When you get permission errors on the console, it might be that your iota.ini file has wrong access rights or that your node runs as a service and only the root user can handle it without a password prompt (or various other permission reasons). You can just run `inschpektor` as root user (before running inschpektor, type `sudo -s` and enter your password) in this case. That will work, but I want to say that doing this is generally a very bad habit which can make your computer vulnerable.
- **Performance:** If you want to increase the performance, serve inschpektor over HTTPS. This way, the service worker will get enabled and be able to put a lot of calls and the site skeleton into the cache.
