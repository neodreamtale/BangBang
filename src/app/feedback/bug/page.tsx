'use client'

import Link from "next/link";
import { ArrowLeft, Bug, FileText } from "lucide-react";
import BidlinkDebugPanel from "@/components/BidlinkDebugPanel";
import { useState, useEffect } from "react";
import {
    isBidlinkApp,
    getEnvironmentInfo
} from "@/utils/bidlinkFileInterface";

export default function BugFeedback() {
    const [isBidlink, setIsBidlink] = useState<boolean>(false);

    // 表单状态
    const [formData, setFormData] = useState({
        description: '',
        steps: '',
        contact: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        // 检查是否在Bidlink应用中
        getEnvironmentInfo().then(() => {
            const inBidlinkApp = isBidlinkApp();
            setIsBidlink(inBidlinkApp);
            if (inBidlinkApp) {
                debugger
                loadExceptionLogZip();
            }
        });
    }, []);

    // 处理表单输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.description.trim()) {
            setSubmitResult('请填写问题详情');
            return;
        }

        setIsSubmitting(true);
        setSubmitResult('');

        try {
            setSubmitResult('Bug反馈提交成功！我们会尽快处理您的问题。');
            // 清空表单
            setFormData({
                description: '',
                steps: '',
                contact: ''
            });
            setSelectedFile(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setSubmitResult(`提交失败: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadExceptionLogZip = async () => {

    };


    return (
        <div className="form-container wv-mb-2">
            <div className="form-wrapper">
                {/* 返回按钮 */}
                <Link href="/" className="nav-link">
                    <ArrowLeft size={20} />
                    返回首页
                </Link>

                {/* 页面标题 */}
                <div className="form-header">
                    <Bug size={48} className="text-red-500" />
                    <h1 className="form-title">Bug反馈</h1>
                </div>

                <p className="form-description">
                    请详细描述您遇到的问题，我们会尽快修复
                </p>

                {/* 反馈表单 */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            问题详情 *
                        </label>
                        <textarea
                            id="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="请详细描述问题的发生过程、错误信息等"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="steps" className="form-label">
                            重现步骤
                        </label>
                        <textarea
                            id="steps"
                            rows={4}
                            value={formData.steps}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
                        />
                    </div>

                    {/* Bidlink应用异常日志自动上传 */}
                    {isBidlink && (
                        <div className="info-box form-group">
                            <div className="info-box-content">
                                <FileText size={20} />
                                <span className="form-label" style={{ marginBottom: 0 }}>
                                    异常日志会自动上传
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="contact" className="form-label">
                            联系方式
                        </label>
                        <input
                            type="email"
                            id="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="您的邮箱地址（可选）"
                        />
                    </div>

                    {/* 提交结果显示 */}
                    {submitResult && (
                        <div className={`form-alert ${submitResult.includes('成功')
                            ? 'form-alert-success'
                            : 'form-alert-error'
                            }`}>
                            {submitResult}
                        </div>
                    )}

                    <div className="form-button-group">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="form-button form-button-primary"
                        >
                            {isSubmitting ? '提交中...' : '提交Bug反馈'}
                        </button>
                        <Link
                            href="/"
                            className="form-button form-button-secondary"
                        >
                            取消
                        </Link>
                    </div>
                </form>
            </div>

            {/* 调试面板（仅开发环境显示） */}
            <BidlinkDebugPanel />
        </div>
    );
}
