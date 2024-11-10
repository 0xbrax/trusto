import axios from 'axios';
import {notFound} from 'next/navigation';
import VotePoll from "@/components/custom/votePoll";
import FinalizedPoll from "@/components/custom/finalizedPoll";
import {BorderBeam} from "@/components/ui/border-beam";


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
    }


    return (
        <div id="poll" className="container mx-auto px-4 h-full flex justify-center items-center">
            <div
                className="relative w-full md:w-1/2 overflow-hidden rounded-lg border glass shadow-xl"
            >
                {!finalizedId && <VotePoll data={data}/>}
                {finalizedId && <FinalizedPoll data={data}/>}

                <BorderBeam
                    size={250}
                    duration={12}
                    delay={9}
                    colorFrom="#E34107"
                    colorTo="#DDDDDD"
                />
            </div>
        </div>
    )
}
