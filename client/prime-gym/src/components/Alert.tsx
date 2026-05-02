interface Message
{
  message: string;
}

export default function Alert({message}: Message) : React.ReactElement {
  return (
    <div className="toast toast-end">
      <div className="alert alert-success">
        <span>{message}</span>
      </div>
    </div>
  );
}
