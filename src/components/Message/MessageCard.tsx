export default function MessageCard({
  text,
  from,
  user1,
  serverReceived,
  sent,
  read,
}) {
  return (
    <div
      className={`relative receive-chat flex   ${
        user1 === from ? `justify-end` : `justify-start`
      }`}
    >
      <div
        className={`px-5 mb-2 ${
          user1 === from
            ? `bg-violet-400 text-white`
            : `bg-violet-200 text-slate-500`
        } text-white py-2 text-sm max-w-[80%] rounded font-light`}
      >
        <p>{text}</p>
        {serverReceived && !sent && !read && user1 === from ? (
          <small className="float-right">✓</small>
        ) : null}
        {sent && serverReceived && !read && user1 === from ? (
          <small className="float-right">✓✓</small>
        ) : null}
        {sent && serverReceived && read && user1 === from ? (
          <small className="float-right text-blue-200">✓✓</small>
        ) : null}
      </div>
    </div>
  );
}
