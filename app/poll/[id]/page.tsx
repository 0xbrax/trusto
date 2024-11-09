import axios from 'axios';
import {notFound} from 'next/navigation';
import VotePoll from "@/components/custom/votePoll";


const base_url = process.env.BASE_URL;

export default async function Poll(context: any) {
    const {id} = await context.params;
    const {finalizedId} = await context.searchParams;

    let data = null;

    const getPoll = async () => {
        try {
            const {data} = await axios.get(`${base_url}/api/get-poll?pollId=${id}`);
            return data;
        } catch (error) {
            console.error(error);
            notFound();
        }
    };
    const getResult = async () => {
        try {
            const {data} = await axios.get(`${base_url}/api/get-finalized-poll?finalizedId=${finalizedId}`);
            return data;
        } catch (error) {
            console.error(error);
            notFound();
        }
    }

    if (!finalizedId) {
        data = await getPoll();
    }
    if (finalizedId) {
        data = await getResult();

        console.log('FINALIZED POLL - - -', data)
    }


    return (
        <div className="h-full flex justify-center items-center">
            {!finalizedId && <VotePoll data={data}/>}
            {finalizedId && <span>ciao mondo</span>}
        </div>
    )
}
