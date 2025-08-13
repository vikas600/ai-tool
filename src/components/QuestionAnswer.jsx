import Answer from "./Answers";
const QuestionAnswer = ({ item, idx }) => {
  return (
    <>
      <div
        key={idx }
        className={item.type == "q" ? "flex justify-end" : ""}
      >
        {item.type == "q" ? (
          <li
            key={idx }
            className="text-right p-1 border-8 dark:bg-zinc-700 dark:border-zinc-700 bg-red-100 border-red-100 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit
               "
          >
            <Answer
              ans={item.text}
              totalResult={1}
              index={idx}
              type={item.type}
            />
          </li>
        ) : (
          item.text.map((ansItem, ansidx) => (
            <li key={ansidx } className="text-left p-1">
              <Answer
                ans={ansItem}
                totalResult={item.length}
                type={item.type}
                index={ansidx}
              />
            </li>
          ))
        )}
      </div>
    </>
  );
};
export default QuestionAnswer;
