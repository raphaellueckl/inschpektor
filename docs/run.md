# Running after installation

Always run this command in a terminal: `sudo inschpektor` (it is recommended to start inschpektor with `sudo` permissions. The reason is, that depending on how you setup your IOTA node, inschpektor cannot restart your IOTA node and probably cannot write to your iri config file upon adding/removing neighbors). If you are a skilled linux user and you know the permission system, using sudo is not necessary at all.

After that, you will find it in your browser @ <http://{YOUR-IP}:8732> (tested on Google Chrome and Firefox, desktop and mobile).

# Register node

When you first open the webapp (or when you clicked the 'Reset Inschpektor' button), you can define your node and things related to it.

- HTTPS: If you DO NOT run inschpektor on the same machine, as the your iri runs, and you generally access it over https, then enable that toggle.
- Password: This password can be freely chosen and is not related to anything else than inschpektor.
- Path to iri config (Optional): Please provide the full path to your iri config file, if you want to have inschpektor edit your iri config (for instance, if you add a neighbor or remove one and want to have that persisted in the iri - no more manual work needed). This path must be absolute and not relative!
- Command to restart node (Optional): Any linux command. This will be executed upon clicking the button 'Restart Node' in the 'Manage' view in inschpektor. In my case, the command would be `systemctl restart iota`. NOTE: Don't write `sudo` or anything in here. As soon as this command triggers something like a password prompt, it will not work. If you started inschpektor with `sudo`, it will be sufficient.

# Setup inschpektor directly on the command line

This is not the recommended way to do it, but there is an option to set up and start inschpektor directly from the command line.

NOTE: You have to pass all arguments for this approach to work. If you leave one out, all of the others will be ignored. Also note that setting the password like this reveals it in your bash history.

If you run it locally:

`IRI_PROTOCOL=http IRI_ADDRESS=my-domain-or-ip.com IRI_PORT=14265 PASSWORD=my-top-secret-password RESTART_IRI_COMMAND="systemctl restart iota" npm start`
