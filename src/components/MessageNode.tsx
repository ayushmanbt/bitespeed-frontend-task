import { Handle, NodeProps, Position } from "reactflow";
import whatsappIcon from "../assets/whatsapp.png";
import messageIcon from "../assets/comment-message.svg";

export type MessageData = {
  message: string;
};

export function MessageNode(props: NodeProps<MessageData>) {
  return (
    <>
      <Handle id="sourceHandle" type="source" position={Position.Right} />
      <Handle id="targetHandle" type="target" position={Position.Left} />
      <div className="node-container min-w-[250px] shadow-xl rounded-xl overflow-clip shadow-black/20">
        <div className="bg-emerald-200 px-3 py-1 font-bold flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img className="block" src={messageIcon} width="20px" />
            <p>Send Message</p>
          </div>
          <div>
            <img className="block" src={whatsappIcon} width="20px" />
          </div>
        </div>
        <div className="bg-white px-3 py-2">{props.data?.message}</div>
      </div>
    </>
  );
}
