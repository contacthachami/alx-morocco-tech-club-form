# Excel Integration Setup Guide

## Overview

This guide explains how to connect your Netlify form submissions to Excel for automatic data collection in spreadsheet format.

## Method 1: Netlify Webhooks + Microsoft Power Automate (Recommended)

### Step 1: Set up Microsoft Power Automate

1. Go to [Microsoft Power Automate](https://flow.microsoft.com)
2. Sign in with your Microsoft account
3. Click "Create" → "Automated cloud flow"
4. Name it "ALX Form to Excel"
5. Search for "HTTP" trigger and select "When an HTTP request is received"

### Step 2: Configure the Webhook

1. Copy the HTTP POST URL from Power Automate
2. In your `netlify.toml` file, add the webhook:

```toml
[[forms.alx-volunteer-application]]
  action = "https://your-power-automate-webhook-url"
```

### Step 3: Set up Excel Connection

1. In Power Automate, add a new step
2. Search for "Excel Online (Business)" or "Excel Online (OneDrive)"
3. Select "Add a row into a table"
4. Connect your OneDrive/SharePoint account
5. Select your Excel file and table
6. Map the form fields to Excel columns

### Form Field Mapping:

- **Name**: `{{triggerBody.name}}`
- **Email**: `{{triggerBody.email}}`
- **Phone**: `{{triggerBody.phone}}`
- **University**: `{{triggerBody.university}}`
- **Field of Study**: `{{triggerBody.fieldOfStudy}}`
- **Year of Study**: `{{triggerBody.yearOfStudy}}`
- **Role**: `{{triggerBody.role}}`
- **Experience**: `{{triggerBody.experience}}`
- **Skills**: `{{triggerBody.skills}}`
- **Why Join**: `{{triggerBody.whyJoin}}`
- **Previous Experience**: `{{triggerBody.previousExperience}}`
- **Availability**: `{{triggerBody.availability}}`
- **Newsletter**: `{{triggerBody.newsletter}}`
- **Submitted At**: `{{triggerBody.created_at}}`

## Method 2: Zapier Integration (Alternative)

### Step 1: Create a Zapier Account

1. Sign up at [Zapier](https://zapier.com)
2. Create a new Zap
3. Set trigger as "Webhooks by Zapier" → "Catch Hook"

### Step 2: Configure Netlify Webhook

Add to your `netlify.toml`:

```toml
[[forms.alx-volunteer-application]]
  action = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/"
```

### Step 3: Connect to Excel

1. Add action "Microsoft Excel" → "Create Spreadsheet Row"
2. Connect your Microsoft account
3. Select your Excel file
4. Map the webhook data to Excel columns

## Method 3: Direct Email + Manual Entry

### Step 1: Configure Email Notifications

In your `netlify.toml`, add:

```toml
[forms]
  [forms.alx-volunteer-application]
    action = "/success"

[[forms.alx-volunteer-application]]
  to = "your-email@example.com"
  subject = "New ALX Club Application"
  body = """
  New application received:

  Name: {{ name }}
  Email: {{ email }}
  Phone: {{ phone }}
  University: {{ university }}
  Field of Study: {{ fieldOfStudy }}
  Year of Study: {{ yearOfStudy }}
  Role: {{ role }}
  Experience: {{ experience }}
  Skills: {{ skills }}
  Why Join: {{ whyJoin }}
  Previous Experience: {{ previousExperience }}
  Availability: {{ availability }}
  Newsletter: {{ newsletter }}

  Submitted: {{ created_at }}
  """
```

## Excel Template Setup

### Create Your Excel File

1. Create a new Excel file named "ALX_Club_Applications.xlsx"
2. Create a table with the following columns:

| Column              | Data Type | Description                                         |
| ------------------- | --------- | --------------------------------------------------- |
| Name                | Text      | Full name of applicant                              |
| Email               | Text      | Email address                                       |
| Phone               | Text      | Phone number                                        |
| University          | Text      | University name                                     |
| Field_of_Study      | Text      | Academic field                                      |
| Year_of_Study       | Text      | Current year                                        |
| Role                | Text      | Preferred role                                      |
| Experience          | Text      | Experience level                                    |
| Skills              | Text      | Technical skills                                    |
| Why_Join            | Text      | Motivation                                          |
| Previous_Experience | Text      | Past experience                                     |
| Availability        | Text      | Time availability                                   |
| Newsletter          | Text      | Newsletter subscription                             |
| Submitted_At        | DateTime  | Submission timestamp                                |
| Status              | Text      | Application status (New/Reviewed/Approved/Rejected) |

### Format the Table

1. Select all your data
2. Go to Insert → Table
3. Check "My table has headers"
4. Name your table "ApplicationsTable"

## Testing the Integration

### Test Form Submission

1. Deploy your site to Netlify
2. Submit a test form
3. Check your Excel file for the new row
4. Verify all data is correctly mapped

### Troubleshooting

- **Data not appearing**: Check webhook URL and Power Automate flow
- **Missing fields**: Verify field names match exactly
- **Permission errors**: Ensure Excel file permissions are correct

## Security Considerations

### Data Privacy

- Store Excel files in secure OneDrive/SharePoint locations
- Limit access to necessary team members only
- Consider GDPR compliance for EU applicants

### Webhook Security

- Use HTTPS endpoints only
- Consider adding authentication to webhooks
- Monitor for suspicious activity

## Advanced Features

### Conditional Logic

Add conditions in Power Automate:

- Send different emails based on role selected
- Create separate sheets for different application types
- Set up approval workflows

### Data Validation

- Add data validation rules in Excel
- Format phone numbers consistently
- Validate email addresses

### Notifications

- Set up Teams notifications for new applications
- Send automatic confirmation emails
- Create dashboard views for application tracking

## Support

For technical issues:

- Netlify Forms: [Netlify Support](https://netlify.com/support)
- Power Automate: [Microsoft Support](https://flow.microsoft.com/support)
- Zapier: [Zapier Help Center](https://help.zapier.com)

## Cost Breakdown

### Free Options:

- **Netlify Forms**: 100 submissions/month (free tier)
- **Power Automate**: 750 runs/month (free tier)
- **Zapier**: 100 tasks/month (free tier)

### Paid Options (if needed):

- **Netlify Pro**: $19/month (1,000 submissions)
- **Power Automate**: $15/user/month (unlimited)
- **Zapier Starter**: $19.99/month (750 tasks)
