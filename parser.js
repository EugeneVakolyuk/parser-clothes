import {addNewPost, getAllPostUrl} from "./parsers_function.js";
import {ownPosts} from "./create_post.js";

const newPosts = async () => {
    const allPostDonorSlug = await getAllPostUrl()

    console.log(allPostDonorSlug);

    // const allOurPostSlug = await ownPosts();

    for (const url of allPostDonorSlug) {
        // if (!allOurPostSlug.includes(url)) {
        await addNewPost(url);
        // }
    }
}

addNewPost(
    // 'zhinochij-svitshot-modnij-trend-cogo-sezonu',
    'vse-pro-flis-10-cikavikh-faktiv',
    'bagatosharovist-v-odyazi-trend-2020-stvoryuyemo-cholovichij-luk-na-zimu'
    );

// newPosts();
// addNewPost('10-must-cop-sneaker-releases-launching-in-2024')
