import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useEdgesState,
  useNodesState,
  addEdge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { MessageNode } from "./MessageNode.tsx";
import { forwardRef, useImperativeHandle } from "react";

const nodeTypes = {
  messageNode: MessageNode,
};

/*
const initialNodes = [
  {
    id: "0",
    type: "messageNode",
    position: { x: 99, y: 300 },
    data: { message: "message 0" },
  },
  {
    id: "1",
    type: "messageNode",
    position: { x: 499, y: 100 },
    data: { message: "message 1" },
  },
];
*/

export type FlowBoardHandler = {
  addNewNode: () => void;
  loadNodesandEdges: (nodes: any, edges: any) => void;
};

type Props = {
  setTargetNode: (n: Node) => void;
};

export const FlowBoard = forwardRef<FlowBoardHandler, Props>(
  ({ setTargetNode }: { setTargetNode: Function }, ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useImperativeHandle(ref, () => ({
      addNewNode() {
        setNodes((nodes) => {
          const length = nodes.length;
          const newNode: Node = {
            id: length.toString(),
            type: "messageNode",
            position: { x: 0, y: 0 },
            data: { message: `message ${nodes.length}` },
          };
          return [newNode, ...nodes];
        });
      },
      loadNodesandEdges(nodes: any, edges: any) {
        setNodes(nodes);
        setEdges(edges);
      },
    }));

    const onConnect = (params: any) => setEdges((edg) => addEdge(params, edg));

    return (
      <div className="w-[80%]">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={(_, n) => {
            setTargetNode(n);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          snapToGrid
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    );
  },
);
