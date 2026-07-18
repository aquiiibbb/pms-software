import { PageHeader } from "../components/UI";
import { policies } from "../data/mockData";
import { IconPlus } from "../components/Icons";

export default function Policies() {
  return (
    <div>
      <PageHeader
        title=""
        desc=""
        action={<button className="btn btn-gold"><IconPlus /> Add Policy</button>}
      />

    
    </div>
  );
}
