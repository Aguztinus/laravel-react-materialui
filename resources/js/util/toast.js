import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../components/Notification/Notification";

import useStyles from "../pages/notifications/styles";

function ToastMe(props) {
	var componentProps;
	
	const [notificationsPosition, setNotificationPosition] = useState(2);
	const [errorToastId, setErrorToastId] = useState(null);

	const positions = [
		toast.POSITION.TOP_LEFT,
		toast.POSITION.TOP_CENTER,
		toast.POSITION.TOP_RIGHT,
		toast.POSITION.BOTTOM_LEFT,
		toast.POSITION.BOTTOM_CENTER,
		toast.POSITION.BOTTOM_RIGHT,
	];

	function sendNotification(componentProps, options) {
		var classes = useStyles();

		return toast(
		<Notification
			{...componentProps}
			className={classes.notificationComponent}
		/>,
		options,
		);
	}

	function retryErrorNotification() {
		var componentProps = {
		type: "message",
		message: "Message was sent successfully!",
		variant: "contained",
		color: "success",
		};
		toast.update(errorToastId, {
		render: <Notification {...componentProps} />,
		type: "success",
		});
		setErrorToastId(null);
	}

    if (errorToastId && notificationType === "error") return;

    switch (notificationType) {
      case "info":
        componentProps = {
          type: "feedback",
          message: "New user feedback received",
          variant: "contained",
          color: "primary",
        };
        break;
      case "error":
        componentProps = {
          type: "message",
          message: "Message was not sent!",
          variant: "contained",
          color: "secondary",
          extraButton: "Resend",
          extraButtonClick: retryErrorNotification,
        };
        break;
      default:
        componentProps = {
          type: "shipped",
          message: "The item was shipped",
          variant: "contained",
          color: "success",
        };
    }

    var toastId = sendNotification(componentProps, {
      type: notificationType,
      position: positions[notificationsPosition],
      progressClassName: classes.progress,
      onClose: notificationType === "error" && (() => setErrorToastId(null)),
      className: classes.notification,
    });

    if (notificationType === "error") setErrorToastId(toastId);
  };

  export default ToastMe;