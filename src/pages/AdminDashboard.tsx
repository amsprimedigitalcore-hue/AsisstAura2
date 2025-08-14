import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  LogOut,
  Calendar,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { supabase, Lead, ChatMessage } from '../lib/supabase';
import { CSVLink } from 'react-csv';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchLeads();
  }, [navigate]);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, serviceFilter, dateFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    if (serviceFilter) {
      filtered = filtered.filter(lead =>
        lead.service.toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredLeads(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const csvData = filteredLeads.map(lead => ({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Service: lead.service,
    'Additional Message': lead.additional_message || '',
    Date: formatDate(lead.created_at)
  }));

  const services = ['CGI Ads', 'Graphic Design', 'Web Development', 'Shopify Services', 'Amazon Services', 'Meta Ads'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffbe4a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-anton text-[#2a3747]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://i.postimg.cc/FHB1kmL5/ASSistaura-logo.jpg"
                alt="AssistAura Logo"
                className="w-10 h-10"
              />
              <h1 className="font-anton text-2xl text-[#2a3747]">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-anton"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#ffbe4a] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-anton text-sm text-gray-600">Total Leads</p>
                <p className="font-anton text-2xl text-[#2a3747]">{leads.length}</p>
              </div>
            </div>
          </motion.div>

          {services.slice(0, 3).map((service, index) => {
            const count = leads.filter(lead => lead.service.toLowerCase().includes(service.toLowerCase())).length;
            return (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#2a3747] rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-anton text-sm text-gray-600">{service}</p>
                    <p className="font-anton text-2xl text-[#2a3747]">{count}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbe4a] font-anton"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbe4a] font-anton appearance-none"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffbe4a] font-anton"
              />
            </div>

            <CSVLink
              data={csvData}
              filename={`assistaura-leads-${new Date().toISOString().split('T')[0]}.csv`}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffbe4a] to-[#2a3747] text-white rounded-lg hover:shadow-lg transition-shadow font-anton"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </CSVLink>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left font-anton text-sm text-[#2a3747] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-anton text-[#2a3747]">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-anton text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-anton text-gray-600">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-[#ffbe4a]/20 text-[#2a3747] rounded-full text-sm font-anton">
                        {lead.service}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-anton text-gray-600 text-sm">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex items-center space-x-1 px-3 py-1 bg-[#2a3747] text-white rounded-lg hover:bg-[#2a3747]/80 transition-colors font-anton text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="font-anton text-gray-500">No leads found</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#ffbe4a] to-[#2a3747] p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-anton text-2xl text-white">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Lead Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-[#ffbe4a]" />
                  <div>
                    <p className="font-anton text-sm text-gray-600">Name</p>
                    <p className="font-anton text-[#2a3747]">{selectedLead.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#ffbe4a]" />
                  <div>
                    <p className="font-anton text-sm text-gray-600">Email</p>
                    <p className="font-anton text-[#2a3747]">{selectedLead.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#ffbe4a]" />
                  <div>
                    <p className="font-anton text-sm text-gray-600">Phone</p>
                    <p className="font-anton text-[#2a3747]">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-[#ffbe4a]" />
                  <div>
                    <p className="font-anton text-sm text-gray-600">Service</p>
                    <p className="font-anton text-[#2a3747]">{selectedLead.service}</p>
                  </div>
                </div>
              </div>

              {selectedLead.additional_message && (
                <div className="mb-6">
                  <p className="font-anton text-sm text-gray-600 mb-2">Additional Message</p>
                  <p className="font-anton text-[#2a3747] bg-gray-50 p-3 rounded-lg">
                    {selectedLead.additional_message}
                  </p>
                </div>
              )}

              {/* Chat History */}
              <div>
                <h3 className="font-anton text-lg text-[#2a3747] mb-4">Chat History</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedLead.chat_history.map((message: ChatMessage) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl font-anton text-sm ${
                          message.role === 'user'
                            ? 'bg-[#ffbe4a] text-white'
                            : 'bg-gray-100 text-[#2a3747]'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;