
# Flutter dart vm service test

### Running

- First run the Flutter app:

```bash
cd flutter_app
fvm flutter run --debug
```

- On the run output you will found the Observatory url:

```
An Observatory debugger and profiler on <device-name> is available at: <ws-observatory-url>
```

- Copy this URL and paste it in the `address` variable on the `src/index.js`

- In another terminal, run:

```bash
yarn start
```
