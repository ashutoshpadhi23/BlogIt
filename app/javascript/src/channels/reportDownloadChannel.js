export const subscribeToReportDownloadChannel = ({
  consumer,
  setMessage,
  setProgress,
  generatePdf,
  slug,
}) => {
  const reportDownloadSubscription = consumer.subscriptions.create(
    {
      channel: "ReportDownloadChannel",
      pubsub_token: slug,
    },
    {
      connected() {
        setMessage("Connected the Cables...");
        generatePdf(slug);
      },
      received(data) {
        const { message, progress } = data;
        setMessage(message);
        setProgress(progress);
      },
    }
  );

  return reportDownloadSubscription;
};
