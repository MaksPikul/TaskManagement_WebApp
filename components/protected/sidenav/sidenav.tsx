import { Separator } from "@/components/ui/separator";
import { Profile, User,} from "../dropdown/profile";
import { Boards} from "./board-button";
import { BoardList } from "./board-list";
import { AppFeatures } from "./feature-list";
import { auth } from "@/auth";
import { getBoardByUserId } from "@/data/hobbies";
import { CreateProjectButton } from "./create-button"
import { Plus} from 'lucide-react';

export const SideNav = async () => {
    const session = await auth()
    const boards = await getBoardByUserId(session?.user?.id)
    
    return(
        <div className="w-64 bg-red-500 flex flex-col items-center gap-y-1">
            <div id="placeholder logo" className="h-16  w-full border-solid border-b-2 border-black bg-green-500"></div>
                <AppFeatures />
            <Separator className="bg-black"/>
                <CreateProjectButton label="Create Hobby" icon={<Plus />} />
            <Separator className="bg-black"/>
                <BoardList boards={boards as Boards} storageKey={"nav-state"} />
                {/* <SharedProjectList /> */}
            <Separator className="bg-black"/>
                <Profile user={session?.user as User}/>
        </div>
    )


}