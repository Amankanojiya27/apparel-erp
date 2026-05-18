// File: app/styles/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowLeft, MessageSquare, Calendar, Package, User, Clock } from 'lucide-react';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { calculatePriorityInsight } from '@/lib/planning';
import { ReversePlanCard } from '@/components/ReversePlanCard';

export default function StyleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [style, setStyle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentUser, setCommentUser] = useState('');

  useEffect(() => {
    fetchStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchStyle = async () => {
    try {
      const response = await fetch(`/api/styles/${params.id}`);
      const data = await response.json();
      setStyle(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch style:', error);
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentUser.trim()) return;

    try {
      await fetch(`/api/styles/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: commentUser,
          text: newComment,
        }),
      });
      setNewComment('');
      fetchStyle();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/styles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchStyle();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await fetch(`/api/styles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });
      fetchStyle();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Style not found</div>
      </div>
    );
  }

  const insight = calculatePriorityInsight(
    style.sampleDeadline,
    style.deliveryDate,
    style.quantity,
    style.status
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Style Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Style Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{style.designNumber}</h2>
                    <p className="text-gray-600 mt-1">{style.buyerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(style.priority)}`}>
                      {style.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(style.status)}`}>
                      {style.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Sample Type</h3>
                    <p className="text-gray-900 capitalize">{style.sampleType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Quantity</h3>
                    <p className="text-gray-900">{style.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Sample Deadline</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(style.sampleDeadline)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Date</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(style.deliveryDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Fabric Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="text-gray-900">{style.fabricDetails.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GSM</p>
                      <p className="text-gray-900">{style.fabricDetails.gsm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="text-gray-900">{style.fabricDetails.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-900">{style.fabricDetails.description}</p>
                    </div>
                  </div>
                </div>

                {style.rawMaterials && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Raw Materials</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {style.rawMaterials.buttonsPerGarment && (
                        <div>
                          <p className="text-sm text-gray-600">Buttons Per Garment</p>
                          <p className="text-gray-900">{style.rawMaterials.buttonsPerGarment}</p>
                        </div>
                      )}
                      {style.rawMaterials.other && (
                        <div>
                          <p className="text-sm text-gray-600">Other</p>
                          <p className="text-gray-900">{style.rawMaterials.other}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                    <select
                      value={style.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="sampling">Sampling</option>
                      <option value="approved">Approved</option>
                      <option value="production">Production</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mr-2">Priority:</label>
                    <select
                      value={style.priority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Comments & Discussion</h2>
                  <span className="text-sm text-gray-500">({style.comments?.length || 0})</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {style.comments && style.comments.length > 0 ? (
                    style.comments.map((comment: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{comment.user}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentUser}
                      onChange={(e) => setCommentUser(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Add Comment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned People */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Assigned Team</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {style.merchant?.name || 'Merchant'}
                      </p>
                      <p className="text-sm text-gray-500">Merchant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {style.buyer?.name || style.buyerName}
                      </p>
                      <p className="text-sm text-gray-500">Buyer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">AI Priority Insight</h3>
              </CardHeader>
              <CardContent>
                <span className={`inline-flex rounded-full border px-2 py-1 text-sm font-medium ${getPriorityColor(insight.priority)}`}>
                  {insight.priority} · score {insight.score}
                </span>
                <p className="mt-3 text-sm text-gray-600">{insight.reason}</p>
              </CardContent>
            </Card>

            {['production', 'approved'].includes(style.status) && (
              <ReversePlanCard
                designNumber={style.designNumber}
                buyerName={style.buyerName}
                quantity={style.quantity}
                deliveryDate={style.deliveryDate}
              />
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-gray-900">{formatDate(style.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sample Deadline</p>
                      <p className="text-gray-900">{formatDate(style.sampleDeadline)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="text-gray-900">{formatDate(style.deliveryDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
