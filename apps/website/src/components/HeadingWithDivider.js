import { FcNext } from "react-icons/fc";

export default function HeadingWithDivider({ title }) {
  return (
    <div style={{ margin: "15px 0 15px 0" }}>
      <h3
        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
      >
        <FcNext
          style={{ fontSize: "24px", fontWeight: "bold", marginRight: "8px" }}
        />{" "}
        {title}
      </h3>
      <hr
        style={{
          margin: "0px",
          flexShrink: "0",
          borderWidth: "0px 0px thin",
          borderStyle: "solid",
          borderColor: "darkgray",
        }}
      />
    </div>
  );
}
