// WSTBySituation.tsx

import Layout from "@/components/layout/Layout";
import ResourceManager from "@/components/ResourceManager";
import { useAuth } from "@/hooks/useAuth";

function WSTBySituation() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <div>
      <Layout>
        <ResourceManager user_id={user.id} />
      </Layout>
    </div>
  );
}

export default WSTBySituation;
