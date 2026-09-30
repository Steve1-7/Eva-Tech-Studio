INSERT INTO
    public.jobs (
        title,
        company,
        location,
        job_type,
        salary,
        description,
        apply_url,
        remote,
        featured,
        category
    )
SELECT
    '[DEMO] Frontend Developer',
    'Eva Tech Studio',
    'Johannesburg, South Africa',
    'Contract',
    'Project-based; discuss scope',
    'Demo listing. Help build responsive Next.js experiences, collaborate on design implementation, and improve accessibility and performance. This placeholder is for testing the careers page and can be deleted from Admin > Job Listings.',
    'https://www.linkedin.com/company/eva-tech-studio',
    true,
    true,
    'Engineering'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            public.jobs
        WHERE
            title = '[DEMO] Frontend Developer'
            AND company = 'Eva Tech Studio'
    );

INSERT INTO
    public.jobs (
        title,
        company,
        location,
        job_type,
        salary,
        description,
        apply_url,
        remote,
        featured,
        category
    )
SELECT
    '[DEMO] Digital Marketing Intern',
    'Eva Tech Studio',
    'Johannesburg, South Africa',
    'Internship',
    'Stipend discussed during interview',
    'Demo listing. Support content planning, campaign reporting, and channel research alongside the growth team. This placeholder is for testing the careers page and can be deleted from Admin > Job Listings.',
    'https://www.linkedin.com/company/eva-tech-studio',
    false,
    false,
    'Marketing'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            public.jobs
        WHERE
            title = '[DEMO] Digital Marketing Intern'
            AND company = 'Eva Tech Studio'
    );