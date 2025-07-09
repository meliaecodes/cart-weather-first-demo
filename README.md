# Forge - Weather Conditions

The Charlie Atlas Racing team use a Jira work items to automatically store race results for reviewing later - they want an app that will store the weather conditions at the time the results work item is created along with the race results. 

-> when a jira work item of a partiular type is created, the app will call the weather API and store weather conditions in jira issue entity property (jira API call)
-> A project settings page can be used for storing longitude and latitude for different tracks in project entity properties
-> the stored weather conditions and current conditions will be displayed in the jira issue

Extension activity:
Can you create a Jira project page with a graph showing race times, along with weather conditions? 

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
