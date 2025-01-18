import { useState } from "react"
import axios from "axios"

function App() {
    const [site, setSite] = useState("")
    const [error, setError] = useState("")
    const [groupedLinks, setGroupedLinks] = useState({})
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setGroupedLinks({})
        setLoading(true)
        setActiveTab("")

        let finalSite = site
        if (!/^https?:\/\//.test(site)) {
            finalSite = `https://${site}`
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER}extract-links`,
                {
                    url: finalSite,
                }
            )
            console.log(response.data.groupedLinks)
            setGroupedLinks(response.data.groupedLinks)
            setActiveTab(Object.keys(response.data.groupedLinks)[0])
        } catch (err) {
            console.error("Error fetching links:", err)
            setError("Failed to extract links. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Link Extractor
                </h1>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex-grow">
                            <span className="block text-sm font-medium text-gray-700 mb-2">
                                Enter a website URL:
                            </span>
                            <input
                                type="text"
                                value={site}
                                onChange={(e) => setSite(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="example.com"
                            />
                        </label>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-end"
                        >
                            Extract Links
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-600">
                        Processing... Please wait.
                    </div>
                )}

                {error && (
                    <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {Object.keys(groupedLinks).length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Links by Domain
                            </h3>
                        </div>

                        {/* Scrollable tabs container */}
                        <div className="border-b overflow-x-auto">
                            <div className="flex flex-nowrap min-w-full">
                                {Object.keys(groupedLinks).map((hostname) => (
                                    <button
                                        key={hostname}
                                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-600 hover:text-blue-600 focus:outline-none ${
                                            activeTab === hostname
                                                ? "border-b-2 border-blue-600 text-blue-600"
                                                : "border-transparent"
                                        }`}
                                        onClick={() => setActiveTab(hostname)}
                                    >
                                        {hostname}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table container */}
                        <div className="overflow-x-auto">
                            {activeTab && (
                                <div className="p-4">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Links from {activeTab} (
                                        {groupedLinks[activeTab].length})
                                    </h4>
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Link URL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {groupedLinks[activeTab].map(
                                                (link, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 text-sm">
                                                            <a
                                                                href={link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                                            >
                                                                {link}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
