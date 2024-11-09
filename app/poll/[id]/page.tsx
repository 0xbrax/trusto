import axios from 'axios';
import {notFound} from 'next/navigation';
import VotePoll from "@/components/custom/votePoll";


const base_url = process.env.BASE_URL;

export default async function Poll(context: any) {
    const {id} = context.params;
    const {resultId} = context.query;
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
            const {data} = await axios.get(`${base_url}/api/get-result?resultId=${resultId}`);
            return data;
        } catch (error) {
            console.error(error);
            notFound();
        }
    }

    if (resultId) {
        data = await getPoll();
    } else {
        data = await getResult();
    }


    return (
        <div className="h-full flex justify-center items-center">
            {resultId && <VotePoll data={data}/>}
            {!resultId && <span>ciao mondo</span>}
        </div>
    )
}
