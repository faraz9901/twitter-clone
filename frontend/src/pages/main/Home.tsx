import { useState } from "react";
import CreatePost from "../../components/posts/CreatePost";
import Posts from "../../components/posts/Posts";
import { useAuth } from "../../context/User.Context";

const HomePage = () => {
    const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");
    const { user } = useAuth()

    return (
        <>
            <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
                {/* Header */}
                <div className='flex w-full border-b border-gray-700'>
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                </div>

                {/*  CREATE POST INPUT */}
                <CreatePost />

                {/* POSTS */}
                {user && <Posts feedType={feedType} user={user} />}
            </div>
        </>
    );
};
export default HomePage;