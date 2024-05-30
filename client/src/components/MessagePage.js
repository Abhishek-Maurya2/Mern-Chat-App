import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa6";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    docUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };

  const handleUploadDoc = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadDoc = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    console.log("uploadDoc: ", uploadDoc.url);
    setMessage((preve) => {
      return {
        ...preve,
        docUrl: uploadDoc.url,
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };
  const handleClearUploadDoc = () => {
    setMessage((preve) => {
      return {
        ...preve,
        docUrl: "",
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (
      message.text ||
      message.imageUrl ||
      message.videoUrl ||
      message.docUrl
    ) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          docUrl: message.docUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          docUrl: "",
        });
        console.log("message send", message);
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-surface border flex justify-between items-center px-4 bg-onSecondary">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
                className={`rounded-xl shadow-md min-w-[90px] max-w-[280px] w-fit md:max-w-sm lg:max-w-md object-scale-down px-2 pt-2 ${
                  user._id === msg?.msgByUserId
                    ? "ml-auto bg-[#f0d6f8]"
                    : "bg-[#fdf8ff]"
                }`}
              >
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className="w-full h-full object-scale-down rounded-lg"
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    className="w-full h-full object-scale-down rounded-lg"
                    controls
                  />
                )}
                {msg?.docUrl && (
                  <a
                    href={msg.docUrl}
                    target="_blank"
                    className="text-blue-500 p-2 rounded bg-slate-100"
                  >
                    Download Document
                  </a>
                )}
                <p className="">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="sticky bottom-0 flex ">
            <div className="flex flex-row-reverse justify-end bg-[#f0d6f8]">
              <div
                className=" right-0 cursor-pointer hover:text-red-600"
                onClick={handleClearUploadImage}
              >
                <IoClose size={30} />
              </div>
              <div className="">
                <img
                  src={message.imageUrl}
                  alt="uploadImage"
                  className="w-full h-full max-w-sm object-scale-down"
                />
              </div>
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {/* upload Doc display */}
        {message.docUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadDoc}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <a
                href={message.docUrl}
                target="_blank"
                className="text-blue-500 p-2 rounded bg-slate-100"
              >
                Download Document
              </a>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/**send message */}
      <section className="h-16 bg-surface border flex items-center px-4 bg-onSecondary">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full text-primaryContainer bg-onPrimaryContainer hover:bg-onSecondaryContainer hover:text-secondaryContainer"
          >
            <FaPlus size={20} />
          </button>

          {/**video and image and doc */}
          {openImageVideoUpload && (
            <div className="bg-surface shadow rounded-2xl absolute bottom-14 w-36 p-2 bg-onSecondary">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <label
                  htmlFor="uploadDoc"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaRegFilePdf size={18} />
                  </div>
                  <p>Document</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadDoc"
                  className="hidden"
                  onChange={handleUploadDoc}
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form
          className="h-full w-full flex gap-2 bg-surface"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full bg-surface"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>

      {/* image modal */}
    </div>
  );
};

export default MessagePage;
