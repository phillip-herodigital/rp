﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.34014
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace StreamEnergy.Sample.Commons {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(Namespace="http://www.example.com/webservices/", ConfigurationName="Sample.Commons.SampleStreamCommonsSoap")]
    public interface SampleStreamCommonsSoap {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://www.example.com/webservices/GetInvoices", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        StreamEnergy.Sample.Commons.GetInvoicesResponse GetInvoices(StreamEnergy.Sample.Commons.GetInvoicesRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://www.example.com/webservices/GetInvoices", ReplyAction="*")]
        System.Threading.Tasks.Task<StreamEnergy.Sample.Commons.GetInvoicesResponse> GetInvoicesAsync(StreamEnergy.Sample.Commons.GetInvoicesRequest request);
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.33440")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://www.example.com/webservices/")]
    public partial class Invoice : object, System.ComponentModel.INotifyPropertyChanged {
        
        private string accountNumberField;
        
        private string serviceTypeField;
        
        private string invoiceNumberField;
        
        private decimal invoiceAmountField;
        
        private bool invoiceAmountFieldSpecified;
        
        private System.DateTime dueDateField;
        
        private bool dueDateFieldSpecified;
        
        private bool isPaidField;
        
        private bool isPaidFieldSpecified;
        
        private bool canRequestExtensionField;
        
        private bool canRequestExtensionFieldSpecified;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=0)]
        public string AccountNumber {
            get {
                return this.accountNumberField;
            }
            set {
                this.accountNumberField = value;
                this.RaisePropertyChanged("AccountNumber");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=1)]
        public string ServiceType {
            get {
                return this.serviceTypeField;
            }
            set {
                this.serviceTypeField = value;
                this.RaisePropertyChanged("ServiceType");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=2)]
        public string InvoiceNumber {
            get {
                return this.invoiceNumberField;
            }
            set {
                this.invoiceNumberField = value;
                this.RaisePropertyChanged("InvoiceNumber");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=3)]
        public decimal InvoiceAmount {
            get {
                return this.invoiceAmountField;
            }
            set {
                this.invoiceAmountField = value;
                this.RaisePropertyChanged("InvoiceAmount");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool InvoiceAmountSpecified {
            get {
                return this.invoiceAmountFieldSpecified;
            }
            set {
                this.invoiceAmountFieldSpecified = value;
                this.RaisePropertyChanged("InvoiceAmountSpecified");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(DataType="date", Order=4)]
        public System.DateTime DueDate {
            get {
                return this.dueDateField;
            }
            set {
                this.dueDateField = value;
                this.RaisePropertyChanged("DueDate");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool DueDateSpecified {
            get {
                return this.dueDateFieldSpecified;
            }
            set {
                this.dueDateFieldSpecified = value;
                this.RaisePropertyChanged("DueDateSpecified");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=5)]
        public bool IsPaid {
            get {
                return this.isPaidField;
            }
            set {
                this.isPaidField = value;
                this.RaisePropertyChanged("IsPaid");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool IsPaidSpecified {
            get {
                return this.isPaidFieldSpecified;
            }
            set {
                this.isPaidFieldSpecified = value;
                this.RaisePropertyChanged("IsPaidSpecified");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Order=6)]
        public bool CanRequestExtension {
            get {
                return this.canRequestExtensionField;
            }
            set {
                this.canRequestExtensionField = value;
                this.RaisePropertyChanged("CanRequestExtension");
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool CanRequestExtensionSpecified {
            get {
                return this.canRequestExtensionFieldSpecified;
            }
            set {
                this.canRequestExtensionFieldSpecified = value;
                this.RaisePropertyChanged("CanRequestExtensionSpecified");
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="GetInvoices", WrapperNamespace="http://www.example.com/webservices/", IsWrapped=true)]
    public partial class GetInvoicesRequest {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="http://www.example.com/webservices/", Order=0)]
        public string Username;
        
        public GetInvoicesRequest() {
        }
        
        public GetInvoicesRequest(string Username) {
            this.Username = Username;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="GetInvoicesResponse", WrapperNamespace="http://www.example.com/webservices/", IsWrapped=true)]
    public partial class GetInvoicesResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="http://www.example.com/webservices/", Order=0)]
        [System.Xml.Serialization.XmlElementAttribute("Invoice")]
        public StreamEnergy.Sample.Commons.Invoice[] Invoice;
        
        public GetInvoicesResponse() {
        }
        
        public GetInvoicesResponse(StreamEnergy.Sample.Commons.Invoice[] Invoice) {
            this.Invoice = Invoice;
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface SampleStreamCommonsSoapChannel : StreamEnergy.Sample.Commons.SampleStreamCommonsSoap, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class SampleStreamCommonsSoapClient : System.ServiceModel.ClientBase<StreamEnergy.Sample.Commons.SampleStreamCommonsSoap>, StreamEnergy.Sample.Commons.SampleStreamCommonsSoap {
        
        public SampleStreamCommonsSoapClient() {
        }
        
        public SampleStreamCommonsSoapClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public SampleStreamCommonsSoapClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SampleStreamCommonsSoapClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SampleStreamCommonsSoapClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public StreamEnergy.Sample.Commons.GetInvoicesResponse GetInvoices(StreamEnergy.Sample.Commons.GetInvoicesRequest request) {
            return base.Channel.GetInvoices(request);
        }
        
        public System.Threading.Tasks.Task<StreamEnergy.Sample.Commons.GetInvoicesResponse> GetInvoicesAsync(StreamEnergy.Sample.Commons.GetInvoicesRequest request) {
            return base.Channel.GetInvoicesAsync(request);
        }
    }
}