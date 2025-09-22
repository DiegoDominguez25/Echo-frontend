import Layout from "@/components/layout/Layout";
import link from "@/assets/images/link.png";

function Landing() {
  return (
    <div>
      <Layout>
        <div className="flex flex-col py-6 justify-center">
          <div className="font-bold text-[#8BA1E9] text-xl px-11">
            <h1>INTEGRATED AI TECHNOLOGY</h1>
          </div>
          <div className="mt-5 text-left w-full px-11">
            <h1 className="text-3xl font-semibold">Get feedback on your</h1>
            <h1 className="text-4xl text-[#8BA1E9] font-bold mt-1.5 tracking-wider">
              pronunciation
            </h1>
          </div>
          <div className="mt-12 text-left px-11 leading-7.5">
            <p>
              Record yourself speaking english and we'll tell you how to
              improve.
            </p>
          </div>
          <div className="flex mt-10 gap-5 mx-11 font-bold">
            <button className="flex items-center py-2.5 px-6 bg-[#8BA1E9] text-white rounded-4xl">
              Get Started
              <span>
                <img src={link} className="h-3 w-auto object-contain" />
              </span>
            </button>
            <button className="py-2.5 px-6 border-1 border-gray-500 rounded-4xl">
              Learn More
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Landing;
