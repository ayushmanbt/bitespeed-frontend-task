import { Node, getIncomers, useEdges, useNodes } from "reactflow";
import { FlowBoard, FlowBoardHandler } from "./components/FlowBoard.tsx";
import { Toast } from "./components/Toast.tsx";
import { createRef, useEffect, useState } from "react";

import commentMessageBlue from "./assets/comment-message-blue.svg";
import backIcon from "./assets/arrow-back.svg";

function App() {
  const nodes = useNodes();
  const edges = useEdges();

  const flowBoardRef = createRef<FlowBoardHandler>();

  const [showToast, setShowToast] = useState(false);
  const [isSettingNode, setIsSettingNode] = useState(false);
  const [selectedNode, setSeclectedNode] = useState<Node>();

  const [messageBox, setMessageBox] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setIsSettingNode(true);
      setMessageBox(selectedNode.data.message);
    }
  }, [selectedNode]);

  const updateMessage = (message: string) => {
    setMessageBox(message);
    if (selectedNode) {
      selectedNode.data.message = message;
    }
  };

  const load = (file: File | null) => {
    if (file == null) return;
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      if (!event.target?.result) return;
      const result = JSON.parse(event.target?.result.toString());
      const nodes = result.nodes;
      const edges = result.edges;
      flowBoardRef.current?.loadNodesandEdges(nodes, edges);
    });
    reader.readAsText(file);
  };

  const saveChanges = () => {
    //store the number of nodes with no source attached to their target
    let emptyNodes = 0;
    //using the given utility function getIncomers we check for incoming edges
    //if we have that lenght as 0 that means we have a node with 0 incoming edges
    //if we have more than 1 node with 0 incoming edges that means we can not save
    nodes.forEach((n) => {
      let incomers = getIncomers(n, nodes, edges);
      if (incomers.length == 0) {
        emptyNodes += 1;
      }
    });
    if (emptyNodes >= 2) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } else {
      // a simple save function to save the data as json
      const jsonData = { nodes, edges };
      const stringData = JSON.stringify(jsonData);
      const blob = new Blob([stringData], { type: "text/json;charset=utf-8" });
      const URL = window.URL || window.webkitURL;
      const link = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.download = "FlowData.json";
      anchor.href = link;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {showToast && <Toast message="Can not save flow" />}
      <div className="w-screen gap-4 bg-gray-200 py-2 flex justify-end">
        <button
          className="
          border-slate-600 border-2 rounded-xl  
          text-slate-600 cursor-pointer bg-white 
          py-2 px-4 
          hover:bg-slate-600 hover:text-gray-50 
          transition-colors ease-in-out font-bold"
          onClick={saveChanges}
        >
          Save Changes
        </button>
        <label
          htmlFor="load"
          className="block border-slate-600 border-2 rounded-xl  
          text-slate-600 cursor-pointer bg-white 
          py-2 px-4 mr-5 
          hover:bg-slate-600 hover:text-gray-50 
          transition-colors ease-in-out font-bold"
        >
          Load File
        </label>
        <input
          className="hidden"
          type="file"
          name="load"
          accept="text/json"
          id="load"
          onChange={(e) => load(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <div className="w-screen flex flex-grow">
        <FlowBoard ref={flowBoardRef} setTargetNode={setSeclectedNode} />
        <div
          className="bg-white 
          border-l-2 border-t-2  
          border-l-gray-300 border-t-gray-300 
          w-[20%]"
        >
          {isSettingNode ? (
            <div>
              <div className="flex p-2 border-2 border-gray-300">
                <button
                  onClick={() => {
                    setSeclectedNode(undefined);
                    setIsSettingNode(false);
                  }}
                >
                  <img src={backIcon} width="20px" />
                </button>
                <div className="flex-grow text-center">Message</div>
              </div>
              <div className="flex flex-col p-3">
                <label htmlFor="ti" className="block text-gray-700 mb-1">
                  Text
                </label>
                <textarea
                  className="block p-2 border-2 border-gray-300 w-full"
                  placeholder="Enter the message"
                  value={messageBox}
                  onChange={(e) => updateMessage(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 grid-flow-col mx-2 my-2 gap-2">
              <button
                className="flex flex-col 
                  justify-center items-center 
                  bg-white text-blue-500 
                  rounded-md border-2 border-blue-500 
                  py-4 transition-colors hover:bg-gray-200"
                onClick={() => flowBoardRef.current?.addNewNode()}
              >
                <img src={commentMessageBlue} width="20px" className="mb-2" />
                Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
