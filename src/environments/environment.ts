// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  envName: 'prod',
  ApiHost: 'https://api.testritegroup.com/',
  AuthHost: 'https://authsit.testritegroup.com/auth',
  PcmApiHost: 'https://pcmuat.testritegroup.com:9002/',
  // PcmApiHost: 'http://pcmuat.testritegroup.com:9001/',
  keycloakRealm: 'testritegroup-employee2',
  googleMapsApiKey: 'AIzaSyC5LRTpY8NrH25OMAmTuTmfE4e1a54xOz8',
  backend: 'http://localhost:4200', // Put your backend here
  pcm_path: 'custs/getProductDataByCode' // Production PCM URL
};

