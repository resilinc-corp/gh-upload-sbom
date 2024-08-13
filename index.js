const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const core = require('@actions/core');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

try {

  core.info('Starting SBOM upload to Depdency-Track API Backend');

  const multipartForm = new FormData();

  multipartForm.append('projectName', core.getInput('projectname'));
  multipartForm.append('projectVersion', core.getInput('projectversion'));
  multipartForm.append('autoCreate', 'true');

  multipartForm.append('bom', fs.createReadStream(core.getInput('bom')));

  axios.post(core.getInput('apidomain') + '/api/v1/bom', multipartForm, {
  headers: {
    ...multipartForm.getHeaders(),
    'X-API-Key': core.getInput('apikey')
  }
  })
  .then(response => {
  
    core.info('Upload successful:', response.data);
  })
  .catch(error => {
  
    core.error('Error uploading:', error);
  });
} catch (error) {

  core.error(error.message);
}
