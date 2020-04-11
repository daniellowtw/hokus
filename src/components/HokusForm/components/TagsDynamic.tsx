import React, { useState } from "react";
import { BaseDynamic } from "../../HoForm";
import { Box, TextField } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

interface TagsField {
  type: string;
  key: string;
  default?: string;
  title?: string;
}

const axios = window.require("electron").remote.require("axios");

class TagsDynamic extends BaseDynamic<TagsField, { hasError?: boolean; isLoading: boolean; data: string[] }> {
  constructor(p: any) {
    super(p);
    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    // TODO: Introduce new key for url. Right now uses default as the url to hit
    const urlPath = this.props.context.node.field.default;
    axios
      .get("http://localhost:1313/" + urlPath, { Timeout: 1 })
      .then((d: any) => {
        this.setState({ data: d.data });
      })
      .catch((err: any) => {
        console.error(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  getType() {
    return "tags";
  }

  // We'll only pass in the state once.
  renderComponent() {
    if (this.state.isLoading) {
      return null;
    }
    const { context } = this.props;
    const { currentPath } = context;
    if (currentPath !== context.parentPath) {
      return null;
    }
    return (
      <Tags
        allOptions={this.state.data}
        selected={context.value}
        onChange={v => {
          context.setValue(v);
        }}
      />
    );
  }
}

interface Option {
  value: string;
  display: string;
}

const liftOption = (x: string) => {
  return { value: x, display: x };
};

const Tags: React.FC<{ allOptions: string[]; selected: string[]; onChange: (s: string[]) => void }> = props => {
  const [state, updateState] = useState<{
    currentTags: string[];
    allTags: string[];
    value: string;
  }>({
    currentTags: props.selected,
    allTags: props.allOptions,
    value: ""
  });

  // I think there is a bug for type of v
  const handleOnAutoCompleteChange = (_: any, v: any) => {
    // There is this issue where if multiple is set to true, v is now [](T | T.value)
    const patchHack = (x: string | Option) => (typeof x === "string" ? x : x.value);
    const newValues = v.map(patchHack);
    updateState({ ...state, currentTags: newValues, value: "" });
    props.onChange(newValues);
  };

  const filter = createFilterOptions<Option>();

  return (
    <Box style={{ marginBottom: "12px" }}>
      <Autocomplete
        freeSolo
        autoHighlight={true}
        selectOnFocus={false}
        openOnFocus={false}
        multiple
        id="tags-standard"
        options={state.allTags.map(liftOption)}
        getOptionLabel={x => x.display}
        value={state.currentTags.map(liftOption)}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== "") {
            filtered.push({
              value: params.inputValue,
              display: `${params.inputValue} (new)`
            });
          }
          return filtered;
        }}
        onChange={handleOnAutoCompleteChange}
        renderInput={params => <TextField {...params} variant="standard" label="Tags" placeholder="tags" />}
      />
    </Box>
  );
};

export default TagsDynamic;
