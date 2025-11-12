import Layout from "@/components/layout/Layout";
import ResourceManager from "@/components/ResourceManager";
import { useAuth } from "@/hooks/useAuth";

function WSTBySituation() {
  const { user, authLoading } = useAuth();
  if (authLoading || !user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <div>
      <Layout>
        <ResourceManager />
      </Layout>
    </div>
  );
}

export default WSTBySituation;
