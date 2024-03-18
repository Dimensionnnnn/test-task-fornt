import React from "react";

interface Param {
  id: number;
  name: string;
}

interface ParamValue<T> {
  paramId: number;
  value: T;
}

interface Model<T> {
  paramValues: ParamValue<T>[];
}

interface Props<T> {
  params: Param[];
  model: Model<T>;
  onUpdateModel: (updatedModel: Model<T>) => void;
}

interface State<T> {
  editedModel: Model<T>;
}

class ParamEditor<T extends string> extends React.Component<
  Props<T>,
  State<T>
> {
  constructor(props: Props<T>) {
    super(props);
    const savedModelString = localStorage.getItem("editedModel");
    const savedModel = savedModelString
      ? (JSON.parse(savedModelString) as Model<T>)
      : props.model;
    this.state = {
      editedModel: savedModel,
    };
  }

  handleParamChange = (paramId: number, value: T) => {
    const { editedModel } = this.state;
    const { paramValues } = editedModel;
    const updatedParamValues = paramValues.map((param) => {
      if (param.paramId === paramId) {
        return { ...param, value };
      }
      return param;
    });
    this.setState({
      editedModel: { ...editedModel, paramValues: updatedParamValues },
    });
  };

  handleSaveChanges = () => {
    const { onUpdateModel } = this.props;
    const { editedModel } = this.state;
    localStorage.setItem("editedModel", JSON.stringify(editedModel));
    onUpdateModel(editedModel);
  };

  render() {
    const { params } = this.props;
    const { paramValues } = this.state.editedModel;

    return (
      <div>
        {params.map((param) => (
          <div key={param.id}>
            <label>{param.name}</label>
            <input
              type={"text"}
              value={
                paramValues.find((p) => p.paramId === param.id)?.value || ""
              }
              onChange={(e) =>
                this.handleParamChange(param.id, e.target.value as T)
              }
            />
          </div>
        ))}
        <button onClick={this.handleSaveChanges}>Save</button>
      </div>
    );
  }
}

const App = () => {
  const params: Param[] = [
    { id: 1, name: "Param 1" },
    { id: 2, name: "Param 2" },
  ];
  const model: Model<string> = {
    paramValues: [
      { paramId: 1, value: "Value 1" },
      { paramId: 2, value: "Value 2" },
    ],
  };
  const onUpdateModel = (updatedModel: Model<string>) => {
    console.log("Updated:", updatedModel);
  };
  return (
    <div>
      <ParamEditor<string>
        params={params}
        model={model}
        onUpdateModel={onUpdateModel}
      />
      <button onClick={() => localStorage.clear()}>Clear storage</button>
    </div>
  );
};

export default App;
