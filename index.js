const fs = require('fs');
const http = require('http');
const https = require('https');
const core = require('@actions/core');

try {
  const serverHostname = core.getInput('serverhostname');
  const port = core.getInput('port');
  const protocol = core.getInput('protocol');
  const apiKey = core.getInput('apikey');
  const project = core.getInput('project');
  const projectName = core.getInput('projectname');
  const projectVersion = core.getInput('projectversion');
  const projectTags = core.getInput('projecttags').split(',').map(tag => tag.trim());
  const autoCreate = core.getInput('autocreate') !== 'false';
  const bomFilename = core.getInput('bomfilename');
  const parent = core.getInput('parent');
  const parentName = core.getInput('parentname');
  const parentVersion = core.getInput('parentversion');

  if (protocol !== "http" && protocol !== "https") {
    throw 'protocol "' + protocol + '" not supported, must be one of: https, http'
  }
  const client = (protocol === "http") ? http : https

  if (project === "" && (projectName === "" || projectVersion === "")) {
    throw 'project or projectName + projectVersion must be set'
  }

  if (!autoCreate && project === "") {
    throw 'project can\'t be empty if autoCreate is false'
  }

  if (project === "" && (projectName === "" || projectVersion === "")) {
    throw 'project or projectName + projectVersion must be set'
  }

  if ((parentName === "" && parentVersion !== "") || (parentName !== "" && parentVersion === "")) {
    throw 'parentName + parentVersion must both be set'
  }

  core.info(`Reading BOM: ${bomFilename}...`);
  const bomContents = `{
                          "$schema": "http://cyclonedx.org/schema/bom-1.6.schema.json",
                          "bomFormat": "CycloneDX",
                          "specVersion": "1.6",
                          "serialNumber": "urn:uuid:560dcd32-5307-4ce3-933b-7fe5bebeaffe",
                          "version": 1,
                          "metadata": {
                            "timestamp": "2024-08-12T17:02:51+05:30",
                            "tools": {
                              "components": [
                                {
                                  "type": "application",
                                  "author": "anchore",
                                  "name": "syft",
                                  "version": "1.10.0"
                                }
                              ]
                            },
                            "component": {
                              "bom-ref": "bf6d480f1ba7ed47",
                              "type": "file",
                              "name": "resilinc-ruleengine"
                            }
                          },
                          "components": [
                            {
                              "bom-ref": "pkg:maven/org.aspectj.weaver/aspectj-weaver@1.9.22.1?package-id=5dba4d178467552f",
                              "type": "library",
                              "name": "aspectj-weaver",
                              "version": "1.9.22.1",
                              "cpe": "cpe:2.3:a:https\\:\\/\\/www-eclipse-org\\/aspectj\\/:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*",
                              "purl": "pkg:maven/org.aspectj.weaver/aspectj-weaver@1.9.22.1",
                              "externalReferences": [
                                {
                                  "url": "",
                                  "hashes": [
                                    {
                                      "alg": "SHA-1",
                                      "content": "bca243d0af0db4758fbae45c5f4995cb5dabb612"
                                    }
                                  ],
                                  "type": "build-meta"
                                }
                              ],
                              "properties": [
                                {
                                  "name": "syft:package:foundBy",
                                  "value": "java-archive-cataloger"
                                },
                                {
                                  "name": "syft:package:language",
                                  "value": "java"
                                },
                                {
                                  "name": "syft:package:type",
                                  "value": "java-archive"
                                },
                                {
                                  "name": "syft:package:metadataType",
                                  "value": "java-archive"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:https\\:\\/\\/www-eclipse-org\\/aspectj\\/:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:https\\:\\/\\/www_eclipse_org\\/aspectj\\/:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:https\\:\\/\\/www_eclipse_org\\/aspectj\\/:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:https\\:\\/\\/www-eclipse-org\\/aspectj\\/:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:https\\:\\/\\/www_eclipse_org\\/aspectj\\/:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:org.aspectj.weaver:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:org.aspectj.weaver:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj-weaver:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj-weaver:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj_weaver:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj_weaver:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:org.aspectj.weaver:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj-weaver:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj_weaver:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:weaver:aspectj-weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:weaver:aspectj_weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:aspectj:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:cpe23",
                                  "value": "cpe:2.3:a:weaver:weaver:1.9.22.1:*:*:*:*:*:*:*"
                                },
                                {
                                  "name": "syft:location:0:path",
                                  "value": "/aspectj-weaver.jar"
                                },
                                {
                                  "name": "syft:metadata:virtualPath",
                                  "value": "/aspectj-weaver.jar"
                                }
                              ]
                            }
                          ]
                        }`;
  core.info('SBOM content: ', fs.readFileSync(bomFilename, 'utf8').toString().substring(0, 200));
  let encodedBomContents = Buffer.from(bomContents).toString('base64');
  if (encodedBomContents.startsWith('77u/')) {
    encodedBomContents = encodedBomContents.substring(4);
  }

  let bomPayload;
  if (autoCreate) {
    bomPayload = {
      projectName: projectName,
      projectVersion: projectVersion,
      // projectTags: projectTags.map(tag => ({name: tag})),
      autoCreate: autoCreate,
      bom: encodedBomContents
    }
  } else {
    bomPayload = {
      project: project,
      bom: encodedBomContents
    }
  }

  if (parent && parent.trim().length > 0) {
    bomPayload.parent = parent;
  } else if (parentName && parentName.trim().length > 0 && parentVersion && parentVersion.trim().length > 0) {
    bomPayload.parentName = parentName;
    bomPayload.parentVersion = parentVersion;
  }

  const postData = JSON.stringify(bomPayload);

  const requestOptions = {
    hostname: serverHostname,
    port: port,
    protocol: protocol + ':',
    path: '/api/v1/bom',
    method: 'PUT',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const payloadLog = postData.substring(0, 200);
  const optionsLog = JSON.stringify(requestOptions);

  core.info(`Uploading to Dependency-Track with API request options, payload: ${optionsLog}, ${payloadLog}`);

  const req = client.request(requestOptions, (res) => {
    core.info('Response status code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      core.info('Finished uploading BOM to Dependency-Track server.')
    } else {
      core.setFailed('Failed Response:', JSON.stringify(res.statusCode));
    }
  });

  req.on('error', (e) => {
    core.error(`Problem with request: ${e.message}`);
    core.setFailed(e.message);
  });

  req.write(postData);
  req.end();

} catch (error) {
  core.setFailed(error.message);
}
