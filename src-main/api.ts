/**
 * This is the main API.
 * It's consumed by the SPA.
 */
import configurationDataProvider from "./configuration-data-provider";
import SiteService from "./services/site/site-service";
import WorkspaceService from "./services/workspace/workspace-service";
import * as fs from "fs-extra";
import { hugoDownloader } from "./hugo/hugo-downloader";
import { dirname } from "path";
import { shell } from "electron";
import { Configurations, EmptyConfigurations } from "../global-types";

const siteService = new SiteService();

const api: { [key: string]: (payload: any) => Promise<any> } = {};

async function getWorkspaceService(
  siteKey: string,
  workspaceKey: string
): Promise<{ siteService: SiteService; workspaceService: WorkspaceService }> {
  const workspaceHead = await siteService.getWorkspaceHead(siteKey, workspaceKey);
  if (!workspaceHead) throw new Error("Could not find workspace.");
  else {
    const workspaceService = new WorkspaceService(workspaceHead.path, workspaceHead.key, siteKey);
    return { siteService, workspaceService };
  }
}

api.getConfigurations = async function(options: any): Promise<Configurations | EmptyConfigurations> {
  return configurationDataProvider.getPromise(options);
};

api.openFileExplorer = async function({ path }: any) {
  try {
    const lstat = fs.lstatSync(path);
    if (lstat.isDirectory()) {
      shell.openItem(path);
    } else {
      shell.openItem(dirname(path));
    }
  } catch (e) {}
};

api.listWorkspaces = async function({ siteKey }: any) {
  return siteService.listWorkspaces(siteKey);
};

api.getWorkspaceDetails = async function({ siteKey, workspaceKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  let configuration: any;
  try {
    configuration = await workspaceService.getConfigurationsData();
  } catch (e) {
    return {
      error: `Could not load workspace configuration (website: ${siteKey}, workspace: ${workspaceKey}). ${e.message}`
    };
  }
  try {
    hugoDownloader.download(configuration.hugover);
  } catch (e) {
    // warn about HugoDownloader error?
  }
  return configuration;
};

api.mountWorkspace = async function({ siteKey, workspaceKey }: any) {
  siteService.mountWorkspace(siteKey, workspaceKey);
};

api.serveWorkspace = async function({ siteKey, workspaceKey, serveKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  await workspaceService.serve(serveKey);
  shell.openItem("http://localhost:1313");
};

api.buildWorkspace = async function({ siteKey, workspaceKey, buildKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  await workspaceService.build(buildKey);
};

api.getSingle = async function({ siteKey, workspaceKey, singleKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return await workspaceService.getSingle(singleKey);
};

api.updateSingle = async function({ siteKey, workspaceKey, singleKey, document }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return await workspaceService.updateSingle(singleKey, document);
};

api.listCollectionItems = async function({ siteKey, workspaceKey, collectionKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.listCollectionItems(collectionKey);
};

api.getCollectionItem = async function({ siteKey, workspaceKey, collectionKey, collectionItemKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.getCollectionItem(collectionKey, collectionItemKey);
};

api.createCollectionItemKey = async function({ siteKey, workspaceKey, collectionKey, collectionItemKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return await workspaceService.createCollectionItemKey(collectionKey, collectionItemKey);
};

api.updateCollectionItem = async function({ siteKey, workspaceKey, collectionKey, collectionItemKey, document }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return await workspaceService.updateCollectionItem(collectionKey, collectionItemKey, document);
};

api.createCollectionItemKey = async function({ siteKey, workspaceKey, collectionKey, collectionItemKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.createCollectionItemKey(collectionKey, collectionItemKey);
};

api.copyFilesIntoCollectionItem = async function({
  siteKey,
  workspaceKey,
  collectionKey,
  collectionItemKey,
  targetPath,
  files
}: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.copyFilesIntoCollectionItem(collectionKey, collectionItemKey, targetPath, files);
};

api.deleteCollectionItem = async function({ siteKey, workspaceKey, collectionKey, collectionItemKey }: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.deleteCollectionItem(collectionKey, collectionItemKey);
};

api.renameCollectionItem = async function({
  siteKey,
  workspaceKey,
  collectionKey,
  collectionItemKey,
  collectionItemNewKey
}: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.renameCollectionItem(collectionKey, collectionItemKey, collectionItemNewKey);
};

api.getThumbnailForCollectionItemImage = async function({
  siteKey,
  workspaceKey,
  collectionKey,
  collectionItemKey,
  targetPath
}: any) {
  const { workspaceService } = await getWorkspaceService(siteKey, workspaceKey);
  return workspaceService.getThumbnailForCollectionItemImage(collectionKey, collectionItemKey, targetPath);
};

api.createSite = async function(config: any) {
  await siteService.initializeSite(config);
  configurationDataProvider.invalidateCache();
};

api.publishSite = async function({ siteKey, publishKey }: any) {
  await siteService.publish(siteKey, publishKey);
};

export default api;
