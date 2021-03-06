import React from "react";
import IconBroken from "material-ui/svg-icons/image/broken-image";
import { BaseDynamic } from "../../HoForm";
import Spinner from "../../Spinner";

type BundleImgThumbDynamicField = {
  key: string;
  type: string;
  src?: string;
};

type BundleImgThumbDynamicState = {
  src?: string;
  hasError?: boolean;
};

class BundleImgThumbDynamic extends BaseDynamic<BundleImgThumbDynamicField, BundleImgThumbDynamicState> {
  
  state: BundleImgThumbDynamicState = { }

  renderComponent() {
    return (
      <div style={{ width: "64px", height: "64px", marginBottom: "16px", overflow: "hidden", background: "#16062f" }}>
        {this.state.src === undefined ? (
          <Spinner size={32} margin={16} color={"RGBA(255,255,255,.3)"} />
        ) : this.state.src === "NOT_FOUND" ? (
          <IconBroken className="fadeIn animated" style={{ width: 32, height: 32, margin: 16, color: "#e84b92" }} />
        ) : (
          <img src={this.state.src} className="fadeIn animated" style={{ width: "64xp", height: "64px" }} />
        )}
      </div>
    );
  }

  componentDidMount() {
    let { node, form } = this.props.context;
    let { field, state } = node;
    form.props.plugins.getBundleThumbnailSrc(state[field.src || "src"]).then((src: string) => {
      this.setState({ src });
    });
  }

  getType() {
    return "bundle-image-thumbnail";
  }
}

export default BundleImgThumbDynamic;
