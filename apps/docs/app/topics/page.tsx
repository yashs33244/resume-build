// import {Topicpage} from '@ui/components/topic-page'

import { TopicContentPage } from "../../components/TopicContentPage";



export default function Page() {
  const topic = 'web Development';
  return (
    <main>
      <TopicContentPage topic={topic}/> 
    </main>
  );
}
