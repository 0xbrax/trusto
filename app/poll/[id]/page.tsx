import axios from 'axios';
import {notFound} from 'next/navigation';
import VotePoll from "@/components/custom/votePoll";


const base_url = process.env.BASE_URL;

export default async function Poll({params}: any) {
    const {id} = await params;

    const getPoll = async () => {
        try {
            const {data} = await axios.get(`${base_url}/api/get-poll?pollId=${id}`);
            return data;
        } catch (error) {
            console.error(error);
            notFound();
        }
    };

    const pollData = await getPoll();

    return (
        <div className="h-full p-4 flex justify-center items-center">
            <VotePoll data={pollData}/>
        </div>
    )
}
