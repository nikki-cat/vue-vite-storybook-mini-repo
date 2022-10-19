# vue-storybook-repo

This is a repo for the reproduction of a vite bug that occurs with the latest Storybookjs package (as of right now, `7.0.0-alpha.38`).
Vite has also been updated to version `3.2.0-beta.2`, to make sure all recent bug fixes are included.
Because storybook sets its own vite dependency, i have used yarn's "resolutions" option to set the next vite to override any sub vite dependencies.

## the problem

When trying to run `yarn storybook`, storybook does start the server and at least runs the main skeleton of the app, but no stories or pages are loaded.
In the terminal the following error and output is given:

```shellsession
yarn storybook
yarn run v1.22.19
warning package.json: No license field
$ storybook dev -p 6006
@storybook/cli v7.0.0-alpha.38

info => Loading presets
info => Loading presets
info => Loading presets
info => Starting manager..
(node:26224) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
╭─────────────────────────────────────────────────────╮
│                                                     │
│   Storybook 7.0.0-alpha.38 for vue3-vite started    │
│   3.27 s for manager and 4.94 s for preview         │
│                                                     │
│    Local:            http://localhost:6006/         │
│    On your network:  http://10.253.254.250:6006/    │
│                                                     │
╰─────────────────────────────────────────────────────╯
3:52:12 PM [vite] error while updating dependencies:
Error: ENOENT: no such file or directory, rename 'C:\vueStorybook\vue-storybook-repo\node_modules\.cache\.vite-storybook\deps_temp' -> 'C:\vueStorybook\vue-storybook-repo\node_modules\.cache\.vite-storybook\deps'

```

in the browser i also get the following errors in the console:

```
Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-controls%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-actions%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-backgrounds%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-viewport%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-toolbars%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-measure%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-outline%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
:6006/sb-addons%5Caddon-interactions%5Cmanager.mjs:1          Failed to load resource: the server responded with a status of 404 (Not Found)
client.ts:19 [vite] connecting...
client.ts:134 [vite] connected.
:6006/node_modules/.cache/.vite-storybook/deps/@storybook_vue3-vite.js?v=907fe626:1          Failed to load resource: the server responded with a status of 504 (Gateway Timeout)
```

### How to reproduce

If the error doesnt show up right away, delete the `.cache` folder from `node_modules` and run `yarn storybook` again. The error should now be consistent.

### Somewhat of a workaround

I dont know if this is an actual workaround because it still doesnt quite work, but this procedure will at least allow storybook to successfully load stories and pages. We can now see the components, however i cant do much (likely due to the files that wont load):

_Workaround procedure_

1. Find the file `node_modules/vite/dist/node/chunks/dep-0856a44a.js`
2. Go to line `42613` that has the follow snippet:

   ```javascript
    42605: const processingResult = {
    42606:  metadata,
    42607:  async commit() {
    42608:    // Write metadata file, delete `deps` folder and rename the 42609: `processing` folder to `deps`
    42610:    // Processing is done, we can now replace the depsCacheDir with 42611: processingCacheDir
    42612:    // Rewire the file paths from the temporal processing dir to the 4261: final deps cache dir
    42613:    await removeDir(depsCacheDir);
    42614:    await renameDir(processingCacheDir, depsCacheDir);
    42615:  },
    42616:  cancel() {
    42617:    fs$l.rmSync(processingCacheDir, { recursive: true, force: true });
    42618:  },
    42619: };
   ```

   1. stop build process, if it's running.
   2. Comment out line `42613`.
   3. Run `yarn storybook` again
   4. Storybook now loads the front page successfuly and you can click the pages and see the stories/components. Also the follow is output from the terminal, instead of error:

   ```shellsession
    PS C:\vueStorybook\vue-storybook-repo> yarn storybook
    yarn run v1.22.19
    warning package.json: No license field
    $ storybook dev -p 6006
    @storybook/cli v7.0.0-alpha.38

    info => Loading presets
    info => Loading presets
    info => Loading presets
    info => Starting manager..
    (node:28288) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
    (Use `node --trace-warnings ...` to show where the warning was created)
    ╭─────────────────────────────────────────────────────╮
    │                                                     │
    │   Storybook 7.0.0-alpha.38 for vue3-vite started    │
    │   2.81 s for manager and 3.5 s for preview          │
    │                                                     │
    │    Local:            http://localhost:6006/         │
    │    On your network:  http://10.253.254.250:6006/    │
    │                                                     │
    ╰─────────────────────────────────────────────────────╯
    4:14:02 PM [vite] ✨ new dependencies optimized: @storybook/vue3-vite, @storybook/vue3/preview, @storybook/addon-links/preview, @storybook/addon-docs/preview, @storybook/addon-actions/preview, ...and 5 more
    4:14:02 PM [vite] ✨ optimized dependencies changed. reloading

   ```

   Although in my case, the view is still glitchy and seems like style isnt loaded correctly. I still get "Failed to load resource" in the browser. And for example, the ouit-of-the-box button does not react to being clicked on as on.

   ## System information

```log
OS: Windows 11
node: v18.9.1
yarn: v1.22.19
```

```shellsession
PS C:\vueStorybook\vue-storybook-repo> yarn list vite
yarn list v1.22.19
└─ vite@3.2.0-beta.2
```

```shellsession
PS C:\vueStorybook\vue-storybook-repo> yarn list storybook
yarn list v1.22.19
└─ storybook@7.0.0-alpha.38
```

```shellsession
PS C:\vueStorybook\vue-storybook-repo> yarn list @storybook/*
yarn list v1.22.19
├─ @storybook/addon-actions@7.0.0-alpha.38
├─ @storybook/addon-backgrounds@7.0.0-alpha.38
├─ @storybook/addon-controls@7.0.0-alpha.38
├─ @storybook/addon-docs@7.0.0-alpha.38
├─ @storybook/addon-essentials@7.0.0-alpha.38
├─ @storybook/addon-highlight@7.0.0-alpha.38
├─ @storybook/addon-interactions@7.0.0-alpha.38
├─ @storybook/addon-links@7.0.0-alpha.38
├─ @storybook/addon-measure@7.0.0-alpha.38
├─ @storybook/addon-outline@7.0.0-alpha.38
├─ @storybook/addon-toolbars@7.0.0-alpha.38
├─ @storybook/addon-viewport@7.0.0-alpha.38
├─ @storybook/addons@7.0.0-alpha.38
├─ @storybook/api@7.0.0-alpha.38
├─ @storybook/blocks@7.0.0-alpha.38
├─ @storybook/builder-manager@7.0.0-alpha.38
├─ @storybook/builder-vite@7.0.0-alpha.38
├─ @storybook/channel-postmessage@7.0.0-alpha.38
├─ @storybook/channel-websocket@7.0.0-alpha.38
├─ @storybook/channels@7.0.0-alpha.38
├─ @storybook/cli@7.0.0-alpha.38
├─ @storybook/client-api@7.0.0-alpha.38
├─ @storybook/client-logger@7.0.0-alpha.38
├─ @storybook/codemod@7.0.0-alpha.38
├─ @storybook/components@7.0.0-alpha.38
├─ @storybook/core-client@7.0.0-alpha.38
├─ @storybook/core-common@7.0.0-alpha.38
├─ @storybook/core-events@7.0.0-alpha.38
├─ @storybook/core-server@7.0.0-alpha.38
├─ @storybook/csf-tools@7.0.0-alpha.38
├─ @storybook/csf@0.0.2--canary.49.258942b.0
├─ @storybook/docs-mdx@0.0.1-canary.12433cf.0
├─ @storybook/docs-tools@7.0.0-alpha.38
├─ @storybook/instrumenter@7.0.0-alpha.38
├─ @storybook/mdx1-csf@0.0.5-canary.13.9ce928a.0
├─ @storybook/node-logger@7.0.0-alpha.38
├─ @storybook/postinstall@7.0.0-alpha.38
├─ @storybook/preview-web@7.0.0-alpha.38
├─ @storybook/router@7.0.0-alpha.38
├─ @storybook/semver@7.3.2
├─ @storybook/source-loader@7.0.0-alpha.38
├─ @storybook/store@7.0.0-alpha.38
├─ @storybook/telemetry@7.0.0-alpha.38
├─ @storybook/testing-library@0.0.13
│  ├─ @storybook/addons@6.5.12
│  ├─ @storybook/api@6.5.12
│  ├─ @storybook/channels@6.5.12
│  ├─ @storybook/client-logger@6.5.12
│  ├─ @storybook/core-events@6.5.12
│  ├─ @storybook/csf@0.0.2--canary.4566f4d.1
│  ├─ @storybook/instrumenter@6.5.12
│  ├─ @storybook/router@6.5.12
│  └─ @storybook/theming@6.5.12
├─ @storybook/theming@7.0.0-alpha.38
├─ @storybook/ui@7.0.0-alpha.38
├─ @storybook/vue3-vite@7.0.0-alpha.38
└─ @storybook/vue3@7.0.0-alpha.38
```
