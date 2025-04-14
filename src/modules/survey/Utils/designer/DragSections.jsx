// import React from "react";
// import { useDrag } from "react-dnd";

// const DragSections = () => {
//   const [{ isDraggingSection }, dragSection] = useDrag(() => ({
//     type: "section",
//     item: { section: "section" + Date.now() },
//     collect: (monitor) => ({
//       isDraggingSection: !!monitor.isDragging(),
//     }),
//   }));
//   return (
//     <div>
//       <span
//         className={`d-inline-block text-wrap  ${
//           isDraggingSection ? "text-info" : "text-dark"
//         }`}
//         ref={dragSection}
//       >
//         Section
//       </span>
//     </div>
//   );
// };

// export default DragSections;
