const deploymentType = process.env.deploymentType; //This is evaluated build-time by webpack
const api_root_cloud = `${location.origin}${location.pathname}api`;
const api_root_node = `${location.protocol}//${location.hostname}:3033${location.pathname}api`;

var apiRoot;

switch(deploymentType) {
    case "production":
        apiRoot = api_root_cloud;
        break;
    case "development":
        apiRoot = api_root_node;
        break;
    default:
        apiRoot = api_root_cloud;
}

export const ROOT_PATH = location.pathname;

export const API_ROOT = apiRoot;