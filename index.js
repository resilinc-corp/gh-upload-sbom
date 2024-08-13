const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const core = require('@actions/core');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

try {

  const bomFile = core.getInput('bomfile');
  core.info('Security Analysis will be started with SBOM: ',  bomFile);
  
  const bomContents = fs.readFileSync(bomFile, 'utf8').toString().substring(0, 200);
  core.info('SBOM is available to be uploaded with Contents: ', bomContents);

  core.info('Starting SBOM upload to Dependency-Track API Backend.');
  const multipartForm = new FormData();

  multipartForm.append('projectName', core.getInput('projectname'));
  multipartForm.append('projectVersion', core.getInput('projectversion'));
  multipartForm.append('autoCreate', 'true');

  multipartForm.append('bom', fs.createReadStream(bomFile));

  axios.post(core.getInput('apidomain') + '/api/v1/bom', multipartForm, {
  headers: {
    ...multipartForm.getHeaders(),
    'X-API-Key': core.getInput('apikey')
  }
  })
  .then(response => {
  
    core.info('SBOM upload has been successful: ', response.data);
  })
  .catch(error => {
  
    core.error('Error while uploading SBOM: ', error);
    core.setFailed('Error in File or API request while uploading SBOM.');
  });
} catch (error) {

  const reason = error.message;
  core.error('SBOM Processing Error: ', reason);
  core.setFailed(reason);
}
