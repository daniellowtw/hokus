import React from "react";
import service from "./../services/service";
import { snackMessageService } from "../services/ui-service";
import { HokusForm } from "../components/HokusForm";
import Spinner from "./../components/Spinner";

import { WorkspaceConfig } from "./../types";
import path from "path";
import { instance } from "../api";

type CollectionItemProps = {
  siteKey: string;
  workspaceKey: string;
  collectionKey: string;
  collectionItemKey: string;
};

type CollectionItemState = {
  selectedWorkspaceDetails?: WorkspaceConfig;
  collectionItemValues?: { [k: string]: any };
};

class CollectionItem extends React.Component<CollectionItemProps, CollectionItemState> {
  state: CollectionItemState = {};

  componentWillMount() {
    service.registerListener(this);
  }

  componentWillUnmount() {
    service.unregisterListener(this);
  }

  componentDidMount() {
    const stateUpdate: Partial<CollectionItemState> = {};
    const { siteKey, workspaceKey, collectionKey, collectionItemKey } = this.props;

    Promise.all([
      service.api.getWorkspaceDetails(siteKey, workspaceKey).then(workspaceDetails => {
        stateUpdate.selectedWorkspaceDetails = workspaceDetails;
      }),
      service.api
        .getCollectionItem(siteKey, workspaceKey, collectionKey, collectionItemKey)
        .then(collectionItemValues => {
          stateUpdate.collectionItemValues = collectionItemValues;
        })
    ]).then(() => {
      this.setState(stateUpdate as any);
    });
  }

  handleSave(context: any) {
    const { siteKey, workspaceKey, collectionKey, collectionItemKey } = this.props;

    const promise = service.api.updateCollectionItem(
      siteKey,
      workspaceKey,
      collectionKey,
      collectionItemKey,
      context.data
    );
    promise.then(
      function(updatedValues) {
        snackMessageService.addSnackMessage("Document saved successfully.");
        context.accept(updatedValues);
      },
      function() {
        context.reject("Something went wrong.");
      }
    );
  }

  render() {
    if (this.state.collectionItemValues === undefined || !this.state.selectedWorkspaceDetails) {
      return <Spinner />;
    }

    const { selectedWorkspaceDetails, collectionItemValues } = this.state;
    const { siteKey, workspaceKey, collectionKey, collectionItemKey } = this.props;
    const collection = selectedWorkspaceDetails.collections.find(x => x.key === collectionKey);
    if (!collection) return null;

    return (
      <HokusForm
        rootName={collection.itemtitle || collection.title}
        fields={collection.fields}
        values={{ ...collectionItemValues, __item: collectionItemKey }}
        plugins={{
          openExternallyButton: () => {
            const filePath = path.join(selectedWorkspaceDetails?.path, collection.folder, this.props.collectionItemKey);
            instance.openFileExternally(filePath);
          },
          openBundleFileDialog: ({ title, extensions, targetPath }: any, onFilesReady: any) => {
            return service.api.openFileDialogForCollectionItem(
              siteKey,
              workspaceKey,
              collectionKey,
              collectionItemKey,
              targetPath,
              { title, extensions }
            );
          },
          getBundleThumbnailSrc: (targetPath: string) => {
            return service.api.getThumbnailForCollectionItemImage(
              siteKey,
              workspaceKey,
              collectionKey,
              collectionItemKey,
              targetPath
            );
          }
        }}
        onSave={this.handleSave.bind(this)}
      />
    );
  }
}

export default CollectionItem;
