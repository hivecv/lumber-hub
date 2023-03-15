import {Modal} from "antd";
import {useEffect} from "react";
import {actionsSelector, fetchActions} from "../../redux";
import {useDispatch, useSelector} from "react-redux";

const LiveViewModal = ({device, onClose}) => {
  const dispatch = useDispatch();
  const actions = useSelector(actionsSelector);
  const offer = actions.filter(action => action.type === "RTC_OFFER")[0]

  useEffect(() => {
    if(device) {
      dispatch(fetchActions(device.deviceUUID()))
    }
    const intervalId = setInterval(() => {
      if(!offer && device) {
        dispatch(fetchActions(device.deviceUUID()))
      }
    }, 1000)

    return () => clearInterval(intervalId); //This is important
  }, [device])
  return <Modal
    title={null}
    open={!!device}
    footer={null}
    closable={false}
    wrapClassName="video-modal"
    centered
    onCancel={onClose}
  >
    {JSON.stringify(actions)}
  </Modal>
}

export default LiveViewModal;