import PropTypes from "prop-types";

function ActivityQuoteByDay({ title }) {
   return (
      <div
         className="style-new"
         style={{ fontSize: "20px" }}
      >
         {title}
      </div>
   );
}

ActivityQuoteByDay.propTypes = {
   title: PropTypes.string,
};

export default ActivityQuoteByDay;
